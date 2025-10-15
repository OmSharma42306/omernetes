// export interface serviceType {
//     id: string,
//     name: string,
//     image: string,
//     desired_state: number,
//     current_state: number,
//     env: {},
//     ports: {},
//     volumes: {},
//     createdAt: Date,
//     updatedAt: Date,
//     configId: string
//     userId: string
//   };

type ServiceType = {
  id: string;
  name: string;
  image: string;
  desired_state: number;
  current_state: number;
  env: Record<string, string>;
  ports: string[];
  volumes: string[];
  createdAt: Date;
  updatedAt: Date;
  configId: string;
  userId: string;
};




// example : 
//  Service = {
//   id: '6996582b-e137-4556-9e9d-35edafe748a1',
//   name: 'app',
//   image: 'nginx:latest',
//   desired_state: 3,
//   current_state: 0,
//   env: { NODE_ENV: 'production' },
//   ports: ['8080:80'],
//   volumes: ['/host/path:/container/path'],
//   createdAt: new Date('2025-10-14T13:11:25.633Z'),
//   updatedAt: new Date('2025-10-14T13:11:25.633Z'),
//   configId: '399cb7a1-3e97-4825-afd4-881a36ec2e49',
//   userId: '1fbf31ca-4fa9-45d5-a71a-0efa3542d116',
// };
